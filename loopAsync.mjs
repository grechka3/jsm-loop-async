/*
import * as loopAsync from "./loopAsync.mjs"

const foo = async function ()
{
  try
  {
    await xx.timeoutAsync(100)
    console.log(xx.tssNow())
  }
  catch (e)
  {

  }
}

let tt = loopAsync.interval(foo, 500, true, false)
tt.run()
tt.pause()
tt.resume()


 */


/**
 *  foo должно быть async function
 *  внутри foo нельзя вызывать методы Looper типа pause/resume etc
 */


class Looper
{
    constructor(foo, interval, opts)
    {
        this.immediate = opts.immediate || false
        this.deactivated = false
        this.interval = interval
        this.foo = foo
        this.id = parseInt(Math.random() * 1000)
        this.opts = opts

        if (this.opts.type === 'timeout')
        {
            this.looper = this.runTimeoutAsync
        }
        else if (this.opts.type === 'interval')
        {
            this.looper = this.runIntervalAsync
        }
        if (this.opts.autoRun)
        {
            this.looper()
        }
        else
        {
            this.deactivate = true
        }

    }

    timeoutAsync(ms)
    {
        return new Promise(res => setTimeout(res, ms))
    }

    pause()
    {
        this.deactivated = true
        return this
    }

    resume()
    {
        if (this.deactivated)
        {
            this.deactivated = false
        }
        return this
    }

    run()
    {
        if (this.deactivated)
        {
            this.deactivated = false
            this.looper()
        }
        return this
    }

    async runTimeoutAsync()
    {
        if (!this.immediate)
        {
            await this.timeoutAsync(this.interval)
        }
        while (!this.deactivated)
        {
            try
            {
                await this.foo()
            } catch (e)
            {
                console.error(e)
            }
            await this.timeoutAsync(this.interval)
        }
    }

    async runIntervalAsync()
    {
        if (!this.immediate)
        {
            await this.timeoutAsync(this.interval)
        }
        let t0 = Date.now(), t1
        while (!this.deactivated)
        {
            t0 = Date.now()
            try
            {
                await this.foo()
            } catch (e)
            {
                console.error(e)
            }
            t1 = Date.now()
            if ((t1 - t0) < this.interval)
            {
                await this.timeoutAsync(this.interval - (t1 - t0))
            }
        }

    }


}

/*
  Цикличное выполение foo(). foo must be async
  между концом предыущей и началом следующей итерации задержка interval
  immediate == true - первая итерация без задержки сразу после инициализации
  autoRun - запускать цикл сразу, иначе позже вызовом run()
  В отличии от setInterval() наложения выполнения foo, если время выполнения foo больше interval, не произойдет
 */
export const timeout = (foo, interval, immediate = false, autoRun = true) =>
{
    let opts = {
        immediate,
        async: true,
        type: 'timeout',
        autoRun,
    }
    return new Looper(foo, interval, opts)
}

/*
  Цикличное выполение foo(). foo must be async
  между началами выполнения итераций задержка interval
  если время выполения foo() >= interval, то задержки между итераций не будет
  immediate == true - первая итерация без задержки сразу после инициализации
  autoRun - запускать цикл сразу, иначе позже вызовом run()
  В отличии от setInterval() наложения выполнения foo, если время выполнения foo больше interval, не произойдет
 */
export const interval = (foo, interval, immediate = false, autoRun = true) =>
{
    let opts = {
        immediate,
        async: true,
        type: 'interval',
        autoRun,
    }
    return new Looper(foo, interval, opts)
}
