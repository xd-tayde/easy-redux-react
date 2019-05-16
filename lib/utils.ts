const class2type = {}
"Array Date RegExp Object Error".split(" ").forEach((e) => class2type[ "[object " + e + "]" ] = e.toLowerCase())

/**
 * 类型检测
 * @export string
 * @param { any } obj
 */
export const type = (obj: any) => {
    if (obj == null) return String(obj)
    return typeof obj === "object" ? class2type[ Object.prototype.toString.call(obj) ] || "object" : typeof obj
}

// 对象循环
const forin = (obj: object, fn: (value: any, key: string) => any) => {
    for (const k in obj) obj.hasOwnProperty(k) && fn(obj[k], k)
}

export default {
    extend(obj1, obj2) {
        let obj2type = type(obj2)
        if (obj2type === "object") {
            forin(obj2, (v, k) => {
                let vType = type(v)
                if (vType !== "object" && vType !== "array") {
                    obj1[k] = v
                } else {
                    if (type(obj1[k]) !== vType || obj1[k] === null) {
                        obj1[k] = vType === "object" ? {} : []
                    }
                    this.extend(obj1[k], v)
                }
            })
        } else if (obj2type === "array") {
            for (let i = 0; i < obj2.length; i++) {
                obj1[i] = obj2[i]
            }
        } else {
            obj1 = obj2
        }
        return obj1
    },
    forin,
    type,
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
    },
}
