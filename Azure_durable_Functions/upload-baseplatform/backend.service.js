const axios = require("axios");
var moment = require("moment");
SdvBaseUrl = "https://df9dc980cc97.ngrok.io"
PUSH_BASE_FILENAME = 'integration_data_'
class BackendService {
  DirectUploader
  constructor() {
    require("browser-env")({
      url: SdvBaseUrl,
    });

    this.DirectUploader = require("@rails/activestorage").DirectUpload;
  }

  async sendData(data, authToken) {
    const file = BackendService.createFile(data);
    let blob;
    try {
      blob = await this.directUpload(file, authToken);
    } catch (e) {
      console.error(
        "An error occurred while creating an ActiveStorage blob: %s",
        e
      );
      throw e;
    }

    console.info("Posting blob for file %s to base platform", file.name);

    return axios.post(
      `${SdvBaseUrl}/api/v1/data`,
      { data_object: { data_blob: blob.signed_id } },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }

  directUpload(file, authToken) {
    const DIRECT_UPLOAD_URL = `${SdvBaseUrl}/rails/active_storage/direct_uploads`
    const directUploadUrl = `${DIRECT_UPLOAD_URL}?auth=${authToken}`;
    const directUploader = new this.DirectUploader(file, directUploadUrl, this);
    return new Promise((resolve, reject) => {
      directUploader.create((error, blob) => {
        if (error) {
          reject(error);
        } else {
          resolve(blob);
        }
      });
    });
  }

  static createFile(contents) {
    const now = moment().format("YYYY_MM_DD_HHmm");
    const filename = `${PUSH_BASE_FILENAME}${now}.json`;
    console.log(filename)
    return new File([JSON.stringify(contents)], filename, {
      type: "application/json",
    });
  }
}

module.exports = BackendService;
