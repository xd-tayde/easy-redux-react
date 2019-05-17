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
export const forin = (obj: object, fn: (value: any, key: string) => any) => {
    for (const k in obj) obj.hasOwnProperty(k) && fn(obj[k], k)
}

// 全大写下划线 转 驼峰
export const toHump = (name: string) => {
    return name.toLowerCase().replace(/\_(\w)/g, (all, letter: string) => letter.toUpperCase())
}
