export default function checkAndSetFloat(float_string, setFunc)
{
    const re_float = /^\d+(\.\d*)?$/;
    if(float_string.match(re_float)) setFunc(parseFloat(float_string));
    else setFunc(NaN);
}