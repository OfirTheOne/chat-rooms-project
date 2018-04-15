// const expect = require('expect');

// const {generateMessage} = require('./message');
// const {generateLocationMessage} = require('./message');



// describe('generateMessage', () => {
//     it('should generate a currect message object', () => {
//         let text = 'hello world !';
//         let from = 'ofir@testing.com';
//         let msg = generateMessage(from, text);

//         expect(msg.from).toBe(from);
//         expect(msg.text).toBe(text);        
//         expect(typeof (msg.crearedAt)).toBe('number');    
//     });
// });


// describe('generateLocationMessage', () => {
//     it('should generate a currect location message object', () => {
//         let lat = 12;
//         let lng = 8;
//         let url = `https://www.google.com/maps?q=${lat},${lng}`;
//         let from = 'ofir@testing.com';
//         let locMsg = generateLocationMessage(from, lat, lng);

//         expect(locMsg.from).toBe(from);
//         expect(locMsg.url).toBe(url);        
//         expect(typeof (locMsg.crearedAt)).toBe('number');    
//     });
// });