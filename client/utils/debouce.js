export const debounce = (func,wait)=>{
    let timer;
    return (...args)=>{
       clearTimeout(timer);
       timer = setTimeout(()=>func(...args),wait)
    }
}