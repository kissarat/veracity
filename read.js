const MAX_FILE_SIZE = 256 * 1024 * 1024;

module.exports = function read(reader = process.stdin) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    reader.on("data", function (chunk) {
      chunks.push(chunk);
      if (chunks.reduce((acc, chunk) => acc + chunk.length, 0) > MAX_FILE_SIZE) {
        const error = new Error(
            `File is large than ${MAX_FILE_SIZE / (1024 * 1024)} MB`
        );
        reader.destroy();
        reject(error);
      }
    });
    reader.on("error", function (error) {
      reject(error);
    });
    reader.on("end", function () {
      resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    });
  });
}
