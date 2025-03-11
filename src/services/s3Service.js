import { Storage } from 'aws-amplify';

export async function uploadFile(file, fileName) {
  try {
    const result = await Storage.put(fileName, file, {
      contentType: file.type
    });
    console.log('File uploaded:', result);
    return result.key;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function getFileUrl(fileName) {
  try {
    const url = await Storage.get(fileName);
    return url;
  } catch (error) {
    console.error('Error retrieving file:', error);
    throw error;
  }
}
