/**
 * @flow
 * Created by zhiyuan.huang@rdder.com on 17/6/9.
 */

'use strict'

// decode method for ddder
export default {
  decode (html: string): string {
    return html ? html.replace(/^\s*/, '').replace(/\s*$/, '') : '';
  }
}
