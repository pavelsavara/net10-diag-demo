# net10-diag-demo

Demo for https://github.com/dotnet/runtime/pull/110818

```
$env:NUGET_PACKAGES="$pwd\.nuget"
dotnet run -c Debug --project .\demo\demo.csproj
```

Then open browser dev tools on http://localhost:5116/counter which is WASM page
and you can use dev tools console

```js
globalThis.getDotnetRuntime(0).collectGcDump()
```

The .nettrace file could be coverted for VS via `dotnet-gcdump convert` or opened in `PerfView.exe` as is.

```js
globalThis.getDotnetRuntime(0).collectPerfCounters(5000)
```

The counters could be opened in VS, `PerfView.exe` tools or via `dotnet-trace report xxx.nettrace topN -n 10`
