import pako from 'pako';
import {pageDataFormatHeader_v1} from './config';
import EducativeUtil from '../components/common/ed_util';

// import  { debugData } from './debugDataFile';

export const parsePakoFunc = (data)=>{
    let parsedData = {};
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      try {
        const dataHeaderLength = EducativeUtil.getPageDataHeaderLength();
        const dataHeader = data.substring(0, dataHeaderLength);
        data = data.substring(dataHeaderLength)
        if (pageDataFormatHeader_v1 === dataHeader) {
          parsedData = JSON.parse(pako.inflate(data, {to: 'string', level: 9}))
        } else {
          throw `${dataHeader} is not a recognized header`;
        }
      } catch (e) {
        parsedData = data
      }
    }
    return parsedData;
}