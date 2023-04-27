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


// update the plaintext validity box
function is_valid(hex) {
    for (let i = 1; i <= 16; ++i) {
        let byte = i.toString().padStart(2, '0');

        if (hex.endsWith(byte.repeat(i))) {
            return true;
        }
    }
    return false;
}


let valid_box = document.querySelector(".plaintext-validity");
function update_valid_box(plaintext) {
    if (is_valid(plaintext)) {
        valid_box.innerHTML = "Plaintext is Valid";
        valid_box.style.color = "green";
    }
    else {
        valid_box.innerHTML = "Plaintext is Invalid";
        valid_box.style.color = "red";
    }
}


// xor of two hex strings
function xor(hex1, hex2) {
    let hex3 = "";
    for (let i = 0; i < hex1.length / 2; ++i) {
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


// generate a random hex string
function gen_rand_hex() {
    let rand_hex = "";
    for (let i = 0; i < 32; ++i) {
        rand_hex = rand_hex + get_random_int(0, 15).toString(16);
    }
    return rand_hex;
}

// initialize all inputs
let decrypt_text_hex;
function init() {
    let plaintext_hex = gen_plaintext();
    let ciphertext_hex = gen_rand_hex()
    let init_vector_hex = gen_rand_hex();
    decrypt_text_hex = xor(init_vector_hex, plaintext_hex);

    write_input(plaintext_input, plaintext_hex);
    write_input(ciphertext_input, ciphertext_hex);
    write_input(init_vector_input, init_vector_hex);
    write_input(decrypt_text_input, decrypt_text_hex);
}

// update elements based on the initialization vector
function update() {
    let init_vector_hex = read_input(init_vector_input);

    let regexp = /[0-9a-f]{32}/g;
    if (regexp.test(init_vector_hex)) {
        let plaintext_hex = xor(init_vector_hex, decrypt_text_hex);
        write_input(plaintext_input, plaintext_hex);
        update_valid_box(plaintext_hex);
    }
}

// update the xor equation output
xor_input = document.querySelectorAll(".xor-equation >  input");
function update_xor() {
    let in1 = xor_input[0].value;
    let in2 = xor_input[1].value;
    console.log("yo")

    let regexp = /[0-9a-f]{2}/g;
    if (regexp.test(in1)) {
        regexp.lastIndex = 0;
        if (regexp.test(in2)) {
            xor_input[2].value = xor(in1, in2);
        }
    }
}

init();