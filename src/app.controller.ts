import { Body, Controller, Get, Query, Post, UploadedFiles, UseInterceptors, HttpCode } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import admin  from "firebase-admin";
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Express } from 'express'
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

  
  //////////////////////////////////



  @Post('api')
  ok(@Body() body: any){

    console.log('a ajuns aici ---', body);
    return 'AAAAAAAAAAAAA';
  }


  @Get('api_get')
  ok2(@Query() query: any){

    console.log('a ajuns aici ---', query);
    return 'BBBBBBBBBBBBB';
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
  // const snapshot = await db.collection('users').get();
  // console.log(typeof(snapshot));
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, '=>', doc.data());
  // });
  
///////////////////////////////////////////////
///////////////////////////////////////////////