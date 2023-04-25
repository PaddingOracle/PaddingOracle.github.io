// access all inputs
ciphertext_input = document.querySelectorAll(".ciphertext-input >  input");
decrypt_text_input = document.querySelectorAll(".decrypt-text-input >  input");
init_vector_input = document.querySelectorAll(".init-vector-input >  input");
plaintext_input = document.querySelectorAll(".plaintext-input >  input");

// read and write to inputs
function read_input(input) {
    let hex = "";
    for (let i = 0; i < 16; ++i) {
        hex = hex + input[i].value;
    }
    return hex;
}

function write_input(input, hex) {
    for (let i = 0; i < 16; ++i) {
        input[i].value = hex.slice(2 * i, 2 * i + 2);
    }
}


// convert between hex and uint8 arrays
function hex_to_uint8_arr(hex) {
    let uint8_arr = new Uint8Array(16);
    for (let i = 0; i < 16; ++i) {
        let hex_pair = hex.slice(2 * i, 2 * i + 2);
        uint8_arr[i] = parseInt(hex_pair, 16);
    }
    return uint8_arr;
}

function uint8_arr_to_hex(uint8_arr) {
    let hex = "";
    for (let i = 0; i < 16; ++i) {
        hex = hex + uint8_arr[i].toString(16).padStart(2, '0');
    }
    return hex;
}


// xor of two hex strings
function xor(hex1, hex2) {
    let hex3 = "";
    for (let i = 0; i < 16; ++i) {
        let hex1_slice = hex1.slice(2 * i, 2 * i + 2);
        let hex2_slice = hex2.slice(2 * i, 2 * i + 2);
        let dec1_slice = parseInt(hex1_slice, 16);
        let dec2_slice = parseInt(hex2_slice, 16);
        let dec3_slice = dec1_slice ^ dec2_slice;
        hex3 = hex3 + dec3_slice.toString(16).padStart(2, '0');
    }
    return hex3;
}


// generate a plaintext
let unpad_plaintexts = [
    "a900ddecafc0ffee15de1ec7ab1e",
    "1eaf5a1ad15ea7ab1e",
    "c01ede7ec7edab100dc107",
];

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function gen_plaintext() {
    let unpad_plaintext = unpad_plaintexts[get_random_int(0, unpad_plaintexts.length - 1)];
    let pad_byte = ((32 - unpad_plaintext.length) / 2).toString(16).padStart(2, '0');
    let plaintext = unpad_plaintext.padEnd(32, pad_byte);
    return plaintext;
}


// generate an initialization vector
function gen_init_vec() {
    let init_vec = "";
    for (let i = 0; i < 32; ++i) {
        init_vec = init_vec + get_random_int(0, 15).toString(16);
    }
    return init_vec;
}

// initialize all inputs
async function init() {
    let plaintext_hex = gen_plaintext();
    let init_vector_hex = gen_init_vec();

    write_input(init_vector_input, init_vector_hex);

    let key = await window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );

    let ciphertext_uint8_arr = new Uint8Array(await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: hex_to_uint8_arr(init_vector_hex)
        },
        key,
        hex_to_uint8_arr(plaintext_hex)
    ));

    write_input(ciphertext_input, uint8_arr_to_hex(ciphertext_uint8_arr));

    let decrypt_text_uint8_arr = new Uint8Array(await window.crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: hex_to_uint8_arr("00000000000000000000000000000000")
        },
        key,
        ciphertext_uint8_arr.buffer));

    write_input(decrypt_text_input, uint8_arr_to_hex(decrypt_text_uint8_arr));

    write_input(plaintext_input, xor(init_vector_hex, uint8_arr_to_hex(decrypt_text_uint8_arr)));
}

init();