use std::fs;
use std::io::{self, Write, Read};
use reqwest;
use serde_json::json;
use anyhow::Result;

pub fn generate_random_string() -> String {
    let characters: Vec<char> = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".chars().collect();
    let mut result = String::new();
    let characters_length = characters.len();

    for _ in 0..6 {
        let rand_index = rand::random::<usize>() % characters_length;
        result.push(characters[rand_index]);
    }
    result
}

pub fn create_folder_and_files() -> Result<(), io::Error> {
    let home_dir = std::env::var("HOME").expect("Failed to get home directory");
    let folder_name = "com.sidepod";
    let app_file_name = "app.conf";
    let hash_file_name = "hash.conf";
    let app_support_path = format!("{}/Library/Application Support", home_dir);
    let path = std::path::Path::new(&app_support_path).join(folder_name);

    // create folder if it doesn't exist
    if !path.exists() {
        fs::create_dir_all(&path)?;
    }

    // create app.conf file if it doesn't exist
    let app_file_path = path.join(app_file_name);
    if !app_file_path.exists() {
        fs::File::create(&app_file_path)?;
    }

    // check if hash.conf has contents, if it's empty then generate a string, send an API call, and then write it
    let hash_file_path = path.join(hash_file_name);
    if !hash_file_path.exists() {
        let hash = generate_random_string();
        match send_api_request(&hash) {
            Ok(_) => {
                let mut file = fs::File::create(&hash_file_path)?;
                file.write_all(hash.as_bytes())?;
            }
            Err(e) => {
                eprintln!("Error sending API request: {:?}", e);
            }
        }
    } else {
        let mut contents = String::new();
        let mut file = fs::File::open(&hash_file_path)?;
        file.read_to_string(&mut contents)?;
        if contents.trim().is_empty() {
            let hash = generate_random_string();
            match send_api_request(&hash) {
                Ok(_) => {
                    file.write_all(hash.as_bytes())?;
                }
                Err(e) => {
                    eprintln!("Error sending API request: {:?}", e);
                }
            }
        }
    }
    Ok(())
}

#[tokio::main]
async fn send_api_request(hash: &str) -> Result<()> {
    let client = reqwest::Client::new();
    let url = "https://api.getharmonize.app/create_sidepod_user";

    let payload = json!({
        "hash": hash
    });

    let response = client.post(url).json(&payload).send().await?;

    if !response.status().is_success() {
        anyhow::bail!("Failed to send API request");
    }
    Ok(())
}
