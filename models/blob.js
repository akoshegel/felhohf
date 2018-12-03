const uuid = require('uuid-v4');
const filenamify = require('filenamify');
const fs = require('fs');
const storage = require('azure-storage');
const blobService = storage.createBlobService('h0gw3qblob', 'yiMmSiiHHwWDYco5cIVGLPwyihPLbyJULDKRItV8LwSEKB3DuH3ZCEJfstEPS69e3AjK1uFZGSP9rHW6SoJu7w==');

class Blob {
    
    _constructor() {
        this._email = null;
        if(!fs.existsSync(process.env.dir + '/tmp'))
            fs.mkdirSync(process.env.dir + '/tmp');
    }

    setAccount(storageId) {
        return new Promise((resolve, reject) => {
            const containerName = `${storageId}-container`;
            blobService.createContainerIfNotExists(containerName, {
                publicAccessLevel: 'blob'
            }, function(error, result, response) {
                if (error) {
                    reject({
                        code: 1,
                        msg: 'Connection error.'
                    });
                }
                else {
                    console.log('Successfully created the account blob container or it was already created.');
                    resolve({
                        code: 2,
                        msg: 'Successfully created the account blob container or it was already created.'
                    });
                }
            });     
        })
    }

    listBlobs(storageId) {
        return new Promise((resolve, reject) => {
            const containerName = `${storageId}-container`
            blobService.listBlobsSegmented(containerName, null, (err, data) => {
                if(err) {
                    console.log(err);
                    reject({
                        code: 1,
                        msg: 'Connection error.'
                    });
                } else {
                    resolve({
                        code: 2,
                        data: data.entries 
                    });
                }
            });
        });
    }

    createBlobFromBuffer(storageId, name, data) {
        return new Promise(async (resolve, reject) => {
            try {
                name = await filenamify(name);
                const filePath = process.env.dir + '/tmp/' + name;
                fs.writeFile(filePath, data, (err) => {
                    if(err) {
                        console.log(err);
                        reject({
                            code: 1,
                            msg: 'unable to upload the file.'
                        });
                    }
                    else {
                        const containerName = `${storageId}-container`;
                        blobService.createBlockBlobFromLocalFile(containerName, name.split('.').join('-'), filePath, function(err, result, response) {
                            if(err) {
                                console.log(err); 
                                reject({
                                    code: 1,
                                    msg: 'Connection error.'
                                });
                            }
                            else {
                                console.log(result);
                                console.log(response);
                                resolve({
                                    code: 2,
                                    msg: 'Successfully uploaded the block blob.'
                                })
                            }
                        });
                    }
                })
            }
            catch(e) {
                console.log(e)
                reject({
                    code: 3,
                    msg: 'unable to process the file'
                })
            }
        })
    }

    downloadFile(storageId, blobName) {
        return new Promise((resolve, reject) => {
            const containerName = `${storageId}-container`;
            const fileName = `${process.env.dir}/${blobName.split('-').join('.')}`;
            blobService.getBlobToStream(containerName, blobName, fs.createWriteStream(fileName), function(error, result, response) {
                if(error) {
                    console.log(error);
                    reject({
                        code: 1,
                        msg: 'Connection error.'
                    });
                }
                else {
                    resolve({
                        code: 2,
                        file: fileName
                    });
                }
            });
        })
    }

}

module.exports = new Blob();