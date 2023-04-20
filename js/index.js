ciphertext_input = document.querySelectorAll(".ciphertext-input >  input");
decrypted_input = document.querySelectorAll(".decrypted-input >  input");
init_vector_input = document.querySelectorAll(".init-vector-input >  input");
plaintext_input = document.querySelectorAll(".plaintext-input >  input");

function read_input(input) {
    let hex = "";
    for (let i = 0; i < 16; ++i) {
        let hex = hex + input[i].value;
    }
    return hex;
}

function write_input(input, hex) {
    for (let i = 0; i < 16; ++i) {
        input[i].value = hex.slice(2 * i, 2 * i + 2);
    }
}

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
        hex = hex + uint8_arr[i].toString(16)
    }
    return hex;
}


async function main() {
    init_vector = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
    plaintext_before = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    write_input(init_vector_input, init_vector)

    let key = await window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );

    let ciphertext_buffer = await window.crypto.subtle.encrypt(
        { name: "AES-CBC", iv: hex_to_uint8_arr(init_vector) },
        key,
        hex_to_uint8_arr(plaintext_before)
    );
    let ciphertext = new Uint8Array(ciphertext_buffer)

    write_input(ciphertext_input, uint8_arr_to_hex(ciphertext));

    let decrypted_buffer = await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: hex_to_uint8_arr(init_vector) }, key, ciphertext.buffer);
    let decrypted = new Uint8Array(decrypted_buffer)


    write_input(decrypted_input, uint8_arr_to_hex(decrypted));
}

main();