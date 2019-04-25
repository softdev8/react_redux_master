const Kefir = require("kefir");
const R = require("ramda");

const hasFileReader = function () {
    return typeof FileReader != 'undefined'
};

const hasFormData = function () {
    return !!window.FormData;
};

const hasProgress = function () {
    return "upload" in new XMLHttpRequest;
};

const createUploadProgressEventStream = function (xhr) {
    const emitter = Kefir.emitter();

    xhr.upload.onprogress = function (event) {
        emitter.emit(event);
    };

    return emitter;
};
const decorateUploadProgressCompleteStream = function (eventStream) {
    return eventStream.filter(function (event) {
        return event.lengthComputable
    }).map(function (event) {
        return event.loaded / event.total;
    });
};

const decoratePercentStream = function (completeStream) {
    return completeStream.map(function (complete) {
        return complete * 100 | 0;
    });
};

const createUploadProgressStream = function (xhr) {
    return R.compose(
        decorateUploadProgressCompleteStream,
        createUploadProgressEventStream
    )(xhr)
};



const sendToServer = R.curry(function (serverUrl, formData) {
    const emitter = Kefir.emitter();
    const xhr = new XMLHttpRequest();

    xhr.open('POST', serverUrl);
    xhr.onload = function () {
        emitter.emit({percent:100, status:'complete'});
    };

    decoratePercentStream(createUploadProgressStream(xhr))
        .onValue(function(percent){
            emitter.emit({percent, status:'uploading'});
        });

    xhr.send(formData);

    return emitter;
});

const convertToFormData = function (files) {
    const formData = new FormData();

    R.forEach(function (file) {
        formData.append('file', file);
    })(files);

    return formData;
};

const convertAndSendFiles = R.curry(function (serverUrl, files) {
    return R.compose(sendToServer(serverUrl), convertToFormData)(files);
});

module.exports = {
    convertAndSendFiles,
    getImagePromise,
};