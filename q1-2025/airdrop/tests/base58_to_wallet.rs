use std::io;
use std::io::BufRead;
use bs58;

#[test]
fn base58_to_wallet() {
    println!("Enter your name:");
    let stdin = io::stdin();
    let base58 = stdin.lock().lines().next().unwrap().unwrap();
    //gdtKSTXYULQNx87fdD3YgXkzVeyFeqwtxHm6WdEb5a9YJRnHse7GQr7t5pbepsyvUCk7VvksUGhPt4SZ8JHVSkt
    let wallet = bs58::decode(base58).into_vec().unwrap();
    println!("{:?}", wallet);
}

#[test]
fn wallet_to_base58() {
    let wallet: Vec<u8> = vec![
        237, 240, 250, 208, 72, 36, 231, 76, 110, 6, 182, 220, 36, 218, 193, 134, 147, 193, 77,
        131, 179, 33, 249, 215, 9, 38, 208, 93, 109, 185, 241, 132, 253, 254, 63, 23, 166, 124, 41,
        101, 159, 104, 40, 64, 12, 248, 73, 103, 161, 11, 170, 62, 124, 156, 228, 14, 188, 8, 143,
        84, 194, 130, 144, 47,
    ];
    let base58 = bs58::encode(wallet).into_string();
    println!("{:?}", base58);
}
