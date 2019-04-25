module.exports = {
    onFilesUpdate: console.log.bind(console),

    files: [{
        type: 'html',

        content: '<html>\n\t<head>\n\t\t<script type="text/javascript" src="//code.jquery.com/jquery-1.12.0.js"></script>\n\t</head>\n\t<body>\n\t\t<div id="content"/>\n\t</body>\n\t<script language="javascript" type="text/javascript">\n\t\t$(document).ready(function () {\n\t\t    $(\'#content\').html(\'<span>Hello World!</span>\');\n\t\t});\n\t</script>\n</html>\n',
    }],

    plugins: ['babel'],
};
