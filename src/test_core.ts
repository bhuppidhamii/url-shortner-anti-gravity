import { Snowflake } from './core/services/snowflake.js';
import { Base62 } from './core/services/base62.js';

const snowflake = new Snowflake(1, 1);

console.log('--- Testing Snowflake ID Generation ---');
const id1 = snowflake.nextId();
const id2 = snowflake.nextId();
const id3 = snowflake.nextId();

console.log(`ID 1: ${id1}`);
console.log(`ID 2: ${id2}`);
console.log(`ID 3: ${id3}`);

if (id1 < id2 && id2 < id3) {
    console.log('✅ IDs are sequential and increasing.');
} else {
    console.error('❌ IDs are NOT sequential!');
}

console.log('\n--- Testing Base62 Encoding/Decoding ---');
const originalId = 1234567890123456789n;
const encoded = Base62.encode(originalId);
const decoded = Base62.decode(encoded);

console.log(`Original ID: ${originalId}`);
console.log(`Encoded:     ${encoded}`);
console.log(`Decoded:     ${decoded}`);

if (originalId === decoded) {
    console.log('✅ Base62 encode/decode cycle successful.');
} else {
    console.error('❌ Base62 encode/decode FAILED!');
}

console.log('\n--- Real World Example ---');
const realId = snowflake.nextId();
const shortCode = Base62.encode(realId);
console.log(`Generated ID: ${realId}`);
console.log(`Short Code:   ${shortCode}`);
console.log(`Length:       ${shortCode.length}`);
