const simulateTyping = async (text, delay = 40, callback) => {
  let result = "";
  for (let char of text) {
    result += char;
    callback(result);
    await new Promise(res => setTimeout(res, delay));
  }
};
