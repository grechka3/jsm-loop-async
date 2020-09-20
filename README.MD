## Example

````
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

````