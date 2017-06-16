/**
 * Created by zhiyuan.huang@rdder.com on 17/6/7.
 */
/* @flow */

'use strict';

function endTransformNode(el: ASTElement, options: CompilerOptions) {
  if (el.tag !== 'script') return;
  if (el.attrsMap.type !== 'x-template') return;

  let parent = el.parent;
  if (!parent) return;

  /*
  * 由于xTemplate 的render 函数生成是在genData 阶段做的，
  * 而vue 中，若ASTElement 被标记为plain=true 则会跳过genData 阶段，
  * 所以，强制将父元素标记为plain=false
  *
  * 另外，现在的处理有点偷懒：
  * 只将<script type="x-template"></script> 的父元素标记为plain=false，
  * 影响是xTemplate 子模板只支持声明在组件template 的根子层级
  * */
  parent.plain = false;

  let templateKey = el.attrsMap.id || '"default"';
  let templateValue = el.children[0].text;

  let parentTemplateMaps = parent.xTemplateMaps;

  if (!parentTemplateMaps) parentTemplateMaps = parent.xTemplateMaps = {};

  // 将xTemplate name、value 存到父节点中，同时将script 节点从父节点清除
  parentTemplateMaps[templateKey] = JSON.stringify(templateValue);

  let index = parent.children.indexOf(el);
  parent.children.splice(index, 1);
}

function genData(el: ASTElement) {
  if (el.xTemplateMaps == null) return '';

  let data = 'xTemplateMaps:{';

  let templateMapStrings = [];

  for (let templateKey in el.xTemplateMaps) {
    if (!el.xTemplateMaps.hasOwnProperty(templateKey)) continue;

    templateMapStrings.push(`${templateKey}:${el.xTemplateMaps[templateKey]}`);
  }

  data += templateMapStrings.join(',');

  data += '},';
  return data;
}

export default {
  endTransformNode,
  genData
}
