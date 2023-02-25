const http = require("http");
const qs = require('querystring');

const items = [];

const server = http.createServer((req, res) => {
  if ("/" == req.url) {
    switch (req.method) {
      case "GET":
        show(res);
        break;
      case "POST":
        add(req, res);
        break;
      default:
        badRequest(res);
    }
  } else if (req.url.startsWith('/edit')) {
    switch (req.method) {
      case "GET":
        edit(req, res);
        break;
      case "POST":
        update(req, res);
        break;
      default:
        badRequest(res);
    case 'DELETE':
        remove(req, res);
            break;  
    }
  } else {
    notFound(res);
  }
});

function show(res) {
  const html =
    "<html><head><title>Todo List</title></head><body>" +
    "<h1>Todo List</h1>" +
    "<ul>" +
    items
      .map(function (item, index) {
        return `<li>${item} <a href="/edit/${index}">(edit)</a></li>`;
      })
      .join("") +
    "</ul>" +
    '<form method="post" action="/">' +
    '<p><input type="text" name="item" /></p>' +
    '<p><input type="submit" value="Add Item" /></p>' +
    "</form></body></html>";
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", Buffer.byteLength(html));
  res.end(html);
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("Not Found");
}

function badRequest(res) {
  res.statusCode = 400;
  res.setHeader("Content-Type", "text/plain");
  res.end("Bad Request");
}

function add(req, res) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    const obj = qs.parse(body);
    items.push(obj.item);
    show(res);
  });
}

function edit(req, res) {
  const index = parseInt(req.url.split('/')[2]);
  const item = items[index];
  const html = `
    <html>
      <head>
        <title>Edit Item</title>
      </head>
      <body>
        <h1>Edit Item</h1>
        <form method="post" action="/edit/${index}">
          <p><input type="text" name="item" value="${item}" /></p>
          <p><input type="submit" value="Update Item" /></p>
        </form>
      </body>
    </html>`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", Buffer.byteLength(html));
  res.end(html);
}

function update(req, res) {
  const index = parseInt(req.url.split('/')[2]);
  let body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    const obj = qs.parse(body);
    items[index] = obj.item;
    show(res);
  });
}
function remove(id, res) {
    if (id < items.length) {
      const filename = items[id].filename;
      fs.unlink(path.join(__dirname, "uploads", filename), (err) => {
        if (err) throw err;
        items.splice(id, 1);
        show(res);
      });
    } else {
      notFound(res);
    }
  }
server.listen(3000);
