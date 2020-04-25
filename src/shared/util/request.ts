import request from 'request'

export const doRequest = async (optionsOrUrl: any, method = 'get'): Promise<any> => {
  const promise = (resolve: any, reject: any): any => {
    ;(request as any)[method](optionsOrUrl, (err: any, res: any, body: any) => {
      if (!err && res && (res.statusCode == 200 || res.statusCode == 204)) {
        resolve(body)
      } else if (res && res.statusCode === 404) {
        reject(new Error('Resource not found'))
      } else {
        reject(err)
      }
    })
  }
  return new Promise(promise)
}
