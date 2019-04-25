import EducativeUtil from '../components/common/ed_util';

// This is the current header format being used.
// When we add V2 and beyond, we will start point the following variable
// to the latest format but we still need previous names for backward
// compatibility. Hence actual names are defined with _v* suffixes
export const pageDataFormatHeader_v1 = "json-compress-deflate-pako-v1-xxxxxxxxxxxxxxxxxxxx";

if (pageDataFormatHeader_v1.length != EducativeUtil.getPageDataHeaderLength()) {
  throw "Format header should be 50 characters. No less. No more"
}