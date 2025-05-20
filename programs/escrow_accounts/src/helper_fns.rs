use solana_program::rent::Rent;


// minimum rent needed to make it rent exempt
pub fn calculate_rent(data_len:usize)->u64{
let rent = Rent::default();

rent.minimum_balance(data_len)


}