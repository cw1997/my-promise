import MyPromise from "./MyPromise"

describe('resolve', () => {
  test('Promise resolve', () => {
    const condition = true

    const promise = new Promise<string>((resolve, reject) => {
      if (condition) {
        //resolve('succeed')
        console.log('state: pending', new Date())
        setTimeout(() => {
          resolve('succeed')
          console.log('state: resolve', new Date())
        }, 1000)
      } else {
        reject('failed')
      }
    })

    return expect(promise).resolves.toEqual('succeed');
  });

  test('MyPromise resolve async', () => {
    const condition = true

    const promise = new MyPromise<string>((resolve, reject) => {
//const promise = new Promise<string>((resolve, reject) => {
      if (condition) {
        //resolve('succeed')
        console.log('state: pending', new Date())
        setTimeout(() => {
          resolve('succeed')
          console.log('state: resolve', new Date())
        }, 1000)
      } else {
        reject('failed')
      }
    })

    return expect(promise).resolves.toEqual('succeed');
  });

  test('Promise.resolve const', () => {
    const promise = Promise.resolve('succeed')
    return expect(promise).resolves.toEqual('succeed');
  });

  test('MyPromise.resolve const', () => {
    const promise = MyPromise.resolve('succeed')
    return expect(promise).resolves.toEqual('succeed');
  });

  test('Promise.resolve another promise', () => {
    const anotherPromise = new Promise((resolve, reject) => {
      resolve('succeed')
    })
    const promise = Promise.resolve(anotherPromise)
    return expect(promise).resolves.toEqual('succeed');
  });

  test('MyPromise.resolve another promise', () => {
    const anotherPromise = new MyPromise((resolve, reject) => {
      resolve('succeed')
    })
    const promise = MyPromise.resolve(anotherPromise)
    return expect(promise).resolves.toEqual('succeed');
  });
})

describe('reject', () => {
  test('Promise reject async', () => {
    const condition = false

    const promise = new Promise<string>((resolve, reject) => {
//const promise = new Promise<string>((resolve, reject) => {
      if (condition) {
        //resolve('succeed')
        console.log('state: pending', new Date())
        setTimeout(() => {
          resolve('succeed')
          console.log('state: resolve', new Date())
        }, 1000)
      } else {
        reject('failed')
      }
    })

    return expect(promise).rejects.toEqual('failed');
  });

  test('MyPromise reject async', () => {
    const condition = false

    const promise = new MyPromise<string>((resolve, reject) => {
//const promise = new Promise<string>((resolve, reject) => {
      if (condition) {
        //resolve('succeed')
        console.log('state: pending', new Date())
        setTimeout(() => {
          resolve('succeed')
          console.log('state: resolve', new Date())
        }, 1000)
      } else {
        reject('failed')
      }
    })

    promise.catch(err => {
      expect(err).toEqual('failed')
    })
    //return expect(promise).rejects.toEqual('failed');
  });

  test('Promise.reject const', () => {
    const promise = Promise.reject('failed')
    //promise.catch(err => console.log(err))
    return expect(promise).rejects.toEqual('failed');
  });

  test('MyPromise.reject const', () => {
    const promise = MyPromise.reject('failed')
    promise.catch(err => {
      expect(err).toEqual('failed')
    })
    //return expect(promise).rejects.toEqual('failed');
  });

  test('Promise.reject another promise', () => {
    const anotherPromise = new MyPromise((resolve, reject) => {
      resolve('failed')
    })
    const promise = Promise.reject(anotherPromise)
    //promise.catch(err => console.log(err))
    return expect(promise).rejects.toEqual(anotherPromise);
  });

  test('MyPromise.reject another promise', () => {
    const anotherPromise = new MyPromise((resolve, reject) => {
      resolve('failed')
    })
    const promise = MyPromise.reject(anotherPromise)
    promise.catch(err => {
      expect(err).toEqual(anotherPromise)
    })
    //return expect(promise).rejects.toEqual('failed');
  });
})

describe('Promise.all', () => {
  test('Promise.all all fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(item => Promise.resolve(`succeed: ${item}`))
    const promiseAll = Promise.all(promises)
    return expect(promiseAll).resolves.toEqual(numbers.map(item => `succeed: ${item}`));
  });

  test('MyPromise.all all fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(item => MyPromise.resolve(`succeed: ${item}`))
    const promiseAll = MyPromise.all(promises)
    return expect(promiseAll).resolves.toEqual(numbers.map(item => `succeed: ${item}`));
  });

  test('Promise.all some fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(
      item => item % 2 === 0 ?
        Promise.resolve(`succeed: ${item}`) :
        Promise.reject(`failed: ${item}`)
    )
    const promiseAll = Promise.all(promises)
    promiseAll.then(value => {
      expect(value).toEqual(['succeed: 2'])
    }).catch(reason => {
      expect(reason).toEqual(['failed: 1', 'failed: 3'])
    })
  });

  test('MyPromise.all some fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(
      item => item % 2 === 0 ?
        MyPromise.resolve(`succeed: ${item}`) :
        MyPromise.reject(`failed: ${item}`)
    )
    const promiseAll = MyPromise.all(promises)
    promiseAll.then(value => {
      expect(value).toEqual(['succeed: 2'])
    }).catch(reason => {
      expect(reason).toEqual(['failed: 1', 'failed: 3'])
    })
    //return expect(promiseAll).resolves.toEqual(numbers.map(item => `succeed: ${item}`));
  });
})

describe('Promise.allSettled', () => {
  test('Promise.allSettled all fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(item => Promise.resolve(`succeed: ${item}`))
    const promiseAllSettled = Promise.allSettled(promises)
    return expect(promiseAllSettled).resolves.toEqual(numbers.map(item => ({
      status: "fulfilled",
      value: `succeed: ${item}`
    })));
  });

  test('MyPromise.allSettled all fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(item => MyPromise.resolve(`succeed: ${item}`))
    const promiseAllSettled = MyPromise.allSettled(promises)
    promiseAllSettled.then(value => {
      expect(value).toEqual(numbers.map(item => ({
        status: "fulfilled",
        value: `succeed: ${item}`
      })));
    })
  });

  test('Promise.allSettled some fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(
      item => item % 2 === 0 ?
        MyPromise.resolve(`succeed: ${item}`) :
        MyPromise.reject(`failed: ${item}`)
    )
    const promiseAllSettled = Promise.allSettled(promises)
    promiseAllSettled.then(value => {
      expect(value).toEqual(numbers.map(
        item => item % 2 === 0 ? ({
          status: "fulfilled",
          value: `succeed: ${item}`
        }) : ({
          status: "rejected",
          reason: `failed: ${item}`
        }))
      );
    })
  });

  test('MyPromise.allSettled some fulfilled', () => {
    const numbers = [1,2,3]
    const promises = numbers.map(
      item => item % 2 === 0 ?
        MyPromise.resolve(`succeed: ${item}`) :
        MyPromise.reject(`failed: ${item}`)
    )
    const promiseAllSettled = MyPromise.allSettled(promises)
    promiseAllSettled.then(value => {
      expect(value).toEqual(numbers.map(
        item => item % 2 === 0 ? ({
          status: "fulfilled",
          value: `succeed: ${item}`
        }) : ({
          status: "rejected",
          reason: `failed: ${item}`
        }))
      );
    })
  });
})

describe('Promise.race', () => {

  test('Promise.race', () => {
    const numbers = [1,2,3].reverse()
    //expect(numbers).toEqual([3,2,1]);
    const promises = numbers.map(item => new Promise((resolve, reject) => {
      setTimeout(() => resolve(`succeed: ${item}`), item)
    }))
    const promiseRace = Promise.race(promises)
    return expect(promiseRace).resolves.toEqual(`succeed: 1`);
  });

  test('MyPromise.race', () => {
    const numbers = [1,2,3].reverse()
    expect(numbers).toEqual([3,2,1]);
    const promises = numbers.map(item => new MyPromise((resolve, reject) => {
      setTimeout(() => resolve(`succeed: ${item}`), item)
    }))
    const promiseRace = MyPromise.race(promises)
    return expect(promiseRace).resolves.toEqual('succeed: 1');
  });
})

describe('Promise.any', () => {
  // skip this test, because Promise.any is added on ES2021, now node.js environment doesn't support this method
  test.skip('Promise.any all fulfilled', () => {
    const promise1 = Promise.resolve(1)
    const promise2 = Promise.resolve(2)
    const promise3 = Promise.resolve(3)

    const promises = [promise1, promise2, promise3]
    const promiseAny = Promise.any(promises)
    return expect(promiseAny).resolves.toEqual(1) && expect(promiseAny).rejects.toEqual([]);
  });

  test('MyPromise.any all fulfilled', () => {
    const promise1 = MyPromise.resolve(1)
    const promise2 = MyPromise.resolve(2)
    const promise3 = MyPromise.resolve(3)

    const promises = [promise1, promise2, promise3]
    const promiseAny = MyPromise.any(promises)
    return expect(promiseAny).resolves.toEqual(1) && expect(promiseAny).rejects.toEqual([]);
  });

  // skip this test, because Promise.any is added on ES2021, now node.js environment doesn't support this method
  test.skip('Promise.any some fulfilled', () => {
    const promise1 = Promise.resolve(1)
    const promise2 = Promise.reject(2)
    const promise3 = Promise.resolve(3)

    const promises = [promise1, promise2, promise3, ]
    const promiseAny = Promise.any(promises)
    return expect(promiseAny).resolves.toEqual(1) && expect(promiseAny).rejects.toEqual([]);
  });

  test('MyPromise.any some fulfilled', () => {
    const promise1 = MyPromise.resolve(1)
    const promise2 = MyPromise.reject(2)
    const promise3 = MyPromise.resolve(3)

    const promises = [promise1, promise2, promise3, ]
    const promiseAny = MyPromise.any(promises)
    return expect(promiseAny).resolves.toEqual(1) && expect(promiseAny).rejects.toEqual([]);
  });

  // skip this test, because Promise.any is added on ES2021, now node.js environment doesn't support this method
  test.skip('Promise.any all rejected', () => {
    const promise1 = Promise.reject(1)
    const promise2 = Promise.reject(2)
    const promise3 = Promise.reject(3)

    const promises = [promise1, promise2, promise3, ]
    const promiseAny = Promise.any(promises)

    promiseAny.catch(err => {
      expect(err).toEqual([1, 2, 3])
    })
    //return expect(promiseAny).resolves.toEqual(undefined) && expect(promiseAny).rejects.toEqual([1, 2, 3]);
  });

  test('MyPromise.any all rejected', () => {
    const promise1 = MyPromise.reject(1)
    const promise2 = MyPromise.reject(2)
    const promise3 = MyPromise.reject(3)

    const promises = [promise1, promise2, promise3, ]
    const promiseAny = MyPromise.any(promises)

    promiseAny.catch(err => {
      expect(err).toEqual([1, 2, 3])
    })
    //return expect(promiseAny).resolves.toEqual(undefined) && expect(promiseAny).rejects.toEqual([1, 2, 3]);
  });
})

describe('Promise others', () => {

})
