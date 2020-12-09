type ResolvedCallback<P> = (param?: P) => any;
type RejectedCallback = (param: any) => any;
type Executor<P> = (resolve: ResolvedCallback<P>, reject: RejectedCallback) => void;

enum StateEnum {
    PENDING     = 'pending',
    FULFILLED   = 'fulfilled',
    REJECTED    = 'rejected',
}

class MyPromise<T> {
    private status: StateEnum;

    //private readonly func: Executor<T>;
    private value?: T;
    private reason: any;

    private onFulfilledCallbackList: ResolvedCallback<T>[] = []
    private onRejectedCallbackList: RejectedCallback[] = []

    constructor(func: Executor<T>) {
        this.status = StateEnum.PENDING;
        try {
            func(this._onResolve, this._onReject)
        } catch (e) {
            this._onReject(e);
        }
    }

    // TODO: _onResolve should return a new Promise and _onResolve value is the return value of 'then' callback
    private _onResolve = (value?: T): void => {
        if (this.status === StateEnum.PENDING) {
            this.status = StateEnum.FULFILLED;
        }
        this.value = value;
        while (this.onFulfilledCallbackList.length !== 0) {
            const onFulfilledCallbackItem = this.onFulfilledCallbackList.shift()
            onFulfilledCallbackItem?.(value)
        }
    }

    private _onReject = (reason: any): void => {
        if (this.status === StateEnum.PENDING) {
            this.status = StateEnum.REJECTED;
        }
        this.reason = reason;
        while (this.onRejectedCallbackList.length !== 0) {
            const onRejectedCallbackItem = this.onRejectedCallbackList.shift()
            onRejectedCallbackItem?.(reason)
        }
    }

    public then(onFulfilled: ResolvedCallback<T>, onRejected?: RejectedCallback): MyPromise<T> {
        switch (this.status) {
            case StateEnum.FULFILLED:
                onFulfilled(this.value);
                break;
            case StateEnum.REJECTED:
                onRejected?.(this.reason);
                break;
            case StateEnum.PENDING:
                this.onFulfilledCallbackList.push(onFulfilled)
                onRejected && this.onRejectedCallbackList.push(onRejected)
                break;
        }
        return this;
    }

    public catch(onRejected: RejectedCallback): MyPromise<T> {
        switch (this.status) {
            case StateEnum.REJECTED:
                onRejected(this.reason);
                break;
            case StateEnum.PENDING:
                this.onRejectedCallbackList.push(onRejected)
                break;
        }
        return this;
    }


    public static resolve<T>(param: T): MyPromise<T> {
        if (param instanceof MyPromise) {
            return param
        } else {
            return new MyPromise((subResolve, subReject) => {
                subResolve(param)
            })
        }
    }

    public static reject<T>(param: T): MyPromise<T> {
        return new MyPromise((subResolve, subReject) => {
            subReject(param)
        })
    }


    public static all<T>(promises: MyPromise<any>[]): MyPromise<T[]> {
        const length = promises.length
        let count = 0
        const valueList: T[] = []
        const reasonList: any[] = []
        return new MyPromise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(value => {
                    count++
                    valueList.push(value)
                }).catch(reason => {
                    reasonList.push(reason)
                })
            })
            if (count === length) {
                resolve(valueList)
            } else {
                reject(reasonList)
            }
        })
    }

    public static allSettled(promises: MyPromise<any>[]): MyPromise<MyPromise<any>[]> {
        interface IAllSettled {
            status: string
            value?: any
            reason?: any
        }
        return new MyPromise<any>((resolve, reject) => {
            const resultList: IAllSettled[] = promises.map(promise => {
                let result: IAllSettled = {status: 'pending'}
                promise.then(value => {
                    result = {status: 'fulfilled', value}
                }).catch(reason => {
                    result = {status: 'rejected', reason}
                })
                return result
            })
            resolve(resultList)
        })
    }

    public static race<T>(promises: MyPromise<any>[]): MyPromise<T> {
        return new MyPromise<T>((subResolve, subReject) => {
            promises.forEach(promise => {
                promise.then(data => subResolve(data)).catch(reason => subReject(reason))
            })
        })
    }

    public static any<T>(promises: MyPromise<any>[]): MyPromise<T> {
        let resolved = false
        const reasonList: any[] = []
        return new MyPromise<T>((subResolve, subReject) => {
            promises.forEach(promise => {
                if (resolved) {
                    return
                }
                promise.then(data => {
                    subResolve(data)
                    resolved = true
                }).catch(reason => reasonList.push(reason))
            })
            subReject(reasonList)
        })
    }
}

export default MyPromise;
