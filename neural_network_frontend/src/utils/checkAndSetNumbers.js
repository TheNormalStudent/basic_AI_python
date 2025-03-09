export function checkAndSetFloat(float_string, setFunc)
{
    const re_float = /^\d+(\.\d*)?$/;
    if(float_string.match(re_float)) setFunc(parseFloat(float_string));
    else setFunc(NaN);
}

export function checkAndSetInt(int_string, setFunc)
{
    const re_int = /^[0-9]*$/;
    if(int_string.match(re_int)) setFunc(parseInt(int_string));
    else setFunc(NaN);
}

export function parseNumberList(input) {
    const re_layers = /^\d+(,\s*\d+)*$/;    

    if (!re_layers.test(input)) {
        throw new Error("Invalid input format");
    }
    return input.split(",").map(num => parseInt(num.trim(), 10));
}