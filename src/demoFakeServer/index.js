import R from 'ramda'
import {parsePakoFunc} from '../pakoUtils'

let serverState = localStorage.getItem('demo');

if(!serverState){
	localStorage.setItem('demo', JSON.stringify({summary: {commentsCount: 0, description: "", title: "", tags: "", shareCount: 0, likesCount: 0, viewCount: 0, author: "fahim", date: "Fri Jul 31 2015"}, components: [{id: 1438383993168, mode: "view", content: {root: {content: "2", left_child: {content: "1", left_child: null, fillcolor: "#caff70", color: "#caff70", id: "node_1438383937235", right_child: null, shape: "Mrecord"}, fillcolor: "#caff70", color: "#caff70", id: "node_1438383937234", right_child: {content: "3", left_child: null, fillcolor: "#caff70", color: "#caff70", id: "node_1438383937236", right_child: null, shape: "Mrecord"}, shape: "Mrecord"}, caption: "", version: "1.0"}, type: "BinaryTree"}], pageProperties: {pageAlign: "center"}}));
	serverState = localStorage.getItem('demo');
}

const coverImageId = 1;
const coverImageFileName = 'coverImage';

const tape = [{
    isMyRequest: (reqData)=>(reqData.url.indexOf("fakeUploadUrl") !== -1 && reqData.type === "POST"),

    response: (reqData)=>{
        return JSON.stringify({image_id: coverImageId, file_name: fileName})
    },
}, {
    isMyRequest: (reqData)=>(reqData.url.indexOf("image/upload/url") !== -1 && reqData.type === "GET"),

    response: (reqData)=>{
        return JSON.stringify({image_id: coverImageId, page_id: 5207287069147136, upload_url: "fakeUploadUrl"})
    },
}, {
    isMyRequest: (reqData)=>(reqData.url === "/api/user/info" && reqData.type === "GET"),
    response: ()=> JSON.stringify({user_id: 5629499534213120, email: "test@test.com", full_name: "Educative Author", user_name: "test"}),
}, {
    isMyRequest: (reqData)=>(reqData.url.indexOf("/api/author/page/") === 0 && reqData.type === "PUT"),

    action: (reqData)=>{

        const {data:{page_content}} = reqData;
        localStorage.setItem('demo', JSON.stringify(parsePakoFunc(page_content)))
    },

    response: ()=> '',
}, {
    isMyRequest: (reqData)=>(reqData.url.indexOf("/api/author/page/") === 0 && reqData.type === "GET"),
    response: ()=>JSON.parse(localStorage.getItem('demo')),
}, {
    isMyRequest: (reqData)=>(reqData.url.indexOf("/api/author/profile") === 0 && reqData.type === "GET"),
    response: ()=>JSON.stringify({facebook: null, short_bio: null, cover_image_id: null, full_name: "Educative Author", profile_image_id: null, linkedin: null, twitter: null, github: null, full_bio: null, website: null}),
}]

export default (reqData)=>{
	return new Promise((resolve, reject)=>{
		const tapeItem = R.find((item)=>item.isMyRequest(reqData))(tape);
		if(!tapeItem) {
			console.log(reqData);
			new Error('Expected some reaction from fake server')
			reject();
		}
		if(tapeItem.action){
			tapeItem.action(reqData);
		}

		resolve(tapeItem.response(reqData));
	})
}
