// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import { dotnet } from './dotnet.js'

let initialProgram = `
function add(a,b) { return a+b; }

log(add(1,2));
`;

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports('main.js', {
    window: {
        location: {
            href: () => globalThis.window.location.href
        }
    },
    updateOutput: (text) => {
        document.getElementById('out').innerHTML = text;
    }
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

const inputArea = document.getElementById('inputArea');
inputArea.value = initialProgram;
initialProgram = undefined;
inputArea.addEventListener('change', (e) => {
    const input = e.target.value;
    exports.MyClass.OnChange(input);
});
inputArea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.code == 'Enter') {
        queueMicrotask(() => { exports.MyClass.OnChange(inputArea.value); });
        e.preventDefault();
    }
});
// simulate a change event
inputArea.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
await dotnet.run();