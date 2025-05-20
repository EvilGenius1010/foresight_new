use crate::CONSTANTS::{ LOWER_DAMPING_START, LOWER_LIMIT, UPPER_DAMPING_START, UPPER_LIMIT};

pub fn calculate_betting_ratio(balance_a:f64,balance_b:f64){
// if balance_a>balance_b{let a_more = true;}
// else{let a_more=false;}

// Defines which party has more balance
let (a_more,ratio) = match balance_a>balance_b{
    true=> (true,balance_a/balance_b),
    false=> (false,balance_b/balance_a),
    
};


//use log fn
   let betting_ratio = if ratio < LOWER_LIMIT {
        LOWER_LIMIT
    } else if ratio >= LOWER_LIMIT && ratio < LOWER_DAMPING_START {
        ratio.log(1.5)
    } else if ratio >= LOWER_DAMPING_START && ratio < UPPER_DAMPING_START {
        ratio // You can use log with any base if needed
    } else if ratio >= UPPER_DAMPING_START && ratio < UPPER_LIMIT {
        ratio.log(1.5)
    } else {
        UPPER_LIMIT
    };
// let betting_ratio = ratio.log(1.5);


    
}