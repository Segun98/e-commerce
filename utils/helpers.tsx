//Adds commas to numbers
export function Commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function truncate(str) {
  if (!str) {
    return str;
  }
  if (str.length > 60) {
    return str.slice(0, 60) + "...";
  } else {
    return str;
  }
}

export const nairaSign = <span>&#8358;</span>;

//display toast at the top when on desktop
export function topOrBottom() {
  if (typeof window === "object") {
    return window.screen.width > 1000 ? "top" : "bottom";
  }
  return "bottom";
}
