using System;
using System.Runtime.InteropServices.JavaScript;
using Jint;

public partial class MyClass
{
    public static void Main() {}


    [JSExport]
    internal static void OnChange(string input)
    {
        var engine = new Engine();
        engine.SetValue("log", new Action<object>((o) => {
            Console.WriteLine(o);
            UpdateOutput(o.ToString());
            }));
        engine.Execute(input);
    }

    [JSImport("window.location.href", "main.js")]
    internal static partial string GetHRef();

    [JSImport("updateOutput", "main.js")]
    internal static partial void UpdateOutput(string output);
}
