http = require("http")
fs = require("fs")
picam = require("raspberry-pi-camera-native")

//set up the camera options for the raspberry pi
cameraoptions = {
	width:1280,
	height:720,
	fps:16,
	encoding:'JPEG',
	quality:7
}

//start the camera with the options set above
picam.start(cameraoptions)

//set up the server - just a simple http server on port 80
const server = http.createServer((req,res)=>{
	
	//only accept get requests
	if(req.method == "GET"){

		//if the request is for the stream, provide the video stream
		//otherwise return the webpage that will contain the stream
		if(req.url == "/stream.mjpg"){
				
				//set up the headers
				//simulate a video stream by requiring it to constantly revalidate the image
				res.writeHead(200, {
					'Cache-Control' : 'must-revalidate,pre-check=0,max-age=0',
					Connection:'close',
					'Content-Type':'multipart/x-mixed-replace; boundary=--frame'
				})

				let isReady = true;
				let framehandler= (framedata) => {
					
					//break if we haven't finished sending the last frame
					if(!isReady){
						return
					}

					//send the next frame, update that we're ready to send the next frame when we finish
					isReady = false;
					res.write(`--frame\nContent-Type: image/jpg\nContent-length: ${framedata.length}\n\n`)
					res.write(framedata, function(){
						isReady = true;
					})
				}

				//every time a camera frame is available, update it to the response if we finished sending the last one
				let frameemitter = picam.on("frame", framehandler)


				req.on("close", ()=>{
					frameemitter.removeListener('frame', framehandler);
				})
		}else{
			//return the website that contains the stream
			res.end(fs.readFileSync('/etc/webserver/index.html'))
		}
	}
}).listen(80)