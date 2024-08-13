import { Body, Controller, Get, Query, Post, UploadedFiles, UseInterceptors, HttpCode } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import admin  from "firebase-admin";
import { writeFileSync,  unlinkSync} from 'fs';

const serviceAccount = require("../configFirebase.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


let db = admin.firestore()


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  ///////////////////////////////////
 
  @Post('store_data')
  @UseInterceptors(FilesInterceptor('image'))
  async store_data(@UploadedFiles() files: Express.Multer.File[], @Query() query: any){
    try{
      const {id, title, description, link} = query;
      let arLocationImg = [];
      files.forEach((file, index)=>{
        arLocationImg.push(`${id}${index}`);
        writeFileSync(`./uploads/${id}${index}.jpg`, file.buffer);
      })
      await db.collection('data_store').add({
        title, description, link, data: arLocationImg
      });
      return {type: true}
    }catch(err){
      return {type: false, err}
    }
  }


  @Get('get_data')
  async get_data(@Query() query){

    try{
      const snapshot = await db.collection('data_store').get();
      let arWithData = [];
      snapshot.forEach((doc) => {
        arWithData.push({id: doc.id, data: doc.data()})
      });
      return {type: true, data: arWithData};
    }catch(err){
      return {type: false, err};
    }
  }

  @Post('deleteProduct')
  async deleteProduct(@Body() body){
    const {id, arImages} = body;

    try{
      arImages.forEach((img:string)=>{
        unlinkSync(`./uploads/${img}.jpg`)
      })
      await db.collection('data_store').doc(id).delete();
      return {type: true};
    }catch(err){
      console.log(err);
      return {type: false, err}
    }
  }

  @Post('changeProduct')
  async changeProduct(@Body() body){
    const {title, link, description, id} = body;

    try{
      const col = db.collection('data_store').doc(id);
      await col.update({title, link, description});
      return {type: true};
    }catch(err){
      return {type: false, err}
    }
  }

  

}





