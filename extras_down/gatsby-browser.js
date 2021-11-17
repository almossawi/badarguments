require("./src/styles/overrides.css")

exports.onRouteUpdate = ({ location, prevLocation }) => {
  // console.log(location.pathname);

  // clear custom css
  let rtl_styles = document.getElementById('rtl-styles');
  if(rtl_styles) {
    rtl_styles.parentNode.removeChild(rtl_styles);
  }

  // only set it for rtl translations
  if(location.pathname.indexOf("guide-to-sneaky-rhetoric-arabic") !== -1) {
    let css = 'p {text-align: justify !important;} h1.e1oyruom3 {direction: rtl; font-family: Tajawal, sans-serif;} .e1oyruom4 {display: none !important;}';
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.id = 'rtl-styles';

    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }
}