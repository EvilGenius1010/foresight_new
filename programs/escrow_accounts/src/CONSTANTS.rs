use std::str::Bytes;



pub const UPPER_LIMIT:f64 = 8.0;
pub const LOWER_LIMIT:f64 = 1.0;
pub const LOWER_DAMPING_START:f64 = 1.8;
pub const UPPER_DAMPING_START:f64 = 5.0;

/// seeds for different pda's
pub const place_bet_bytes: &[u8]= b"initbet"; 
pub const init_bet_event_bytes:&[u8]=b"";