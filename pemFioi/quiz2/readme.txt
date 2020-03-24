Grader data format

1. Function
a) may return number or boolean
function(answer) {
    return .. // boolean value
}
b) may return object:
function(answer) {
    return {
        score: .. // number or boolean ( true will add 1 to nb_valid  )
        message: .. // string (optional)
    }
}


2. Array
must be array of correct answers


3. Object
{
    strict: boolean,
    value: .. // string or number value or array of values
    messages: .. // array of messages
}
if strict option is true then value and answer arrays must contain same items in same order


4. Scalar value
value will be compared with answer