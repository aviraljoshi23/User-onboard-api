const sendResponse = (message, data =[]) => {
    return {
        message: message,
        data: data
    };
};

module.exports = sendResponse;