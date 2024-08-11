import { Body, Controller, Get, Query, Post, UploadedFiles, UseInterceptors, HttpCode } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import admin  from "firebase-admin";
import { writeFileSync } from 'fs';
// import * as serviceAccount from "C:Users//habac//Downloads//db-db-9bbfe-firebase-adminsdk-7o1mp-8c8ae93086.json";

const serviceAccount = require("C://Users//habac//Downloads//db-db-9bbfe-firebase-adminsdk-7o1mp-8c8ae93086.json");
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

  

}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
  // const docRef = db.collection('users').doc('1');
  // await docRef.set({
  //   first: 'Adokoka',
  //   last: 'Lovelokokace',
  //   born: 1815, 
  //   sex: 'M'
  // });
  // console.log(docRef);
/////////////////////////////////////////////////////////////////
  // const res = await db.collection('data_store').add(
  //   {
  //     name: 'Tokyo',
  //     country: 'Japan'
  //   }
  // );

/////////////////////////////////////////////////////////////////

// const col = db.collection('data_store').doc('pGwLPn74ci4fG8A9sKWM');
// const res = await col.update({ok: 'nu', name: 'plok'});

////////////////////////////////////////////////////////////////

// const res = await db.collection('data_store').doc('twTV95L4fJnGTiexHP60').delete();


/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
  
///////////////////////////////////////////////
///////////////////////////////////////////////