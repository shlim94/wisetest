Imports Microsoft.VisualBasic
Imports System
Imports System.Collections.Generic
Imports System.ServiceProcess
Imports System.Text

Namespace $rootnamespace$
    Friend NotInheritable Class Program
        ''' <summary>
        ''' The main entry point for the application.
        ''' </summary>
        Private Sub New()
        End Sub
        Shared Sub Main()
            Dim ServicesToRun() As ServiceBase
            ServicesToRun = New ServiceBase() {New ApplicationServerService()}
            ServiceBase.Run(ServicesToRun)
        End Sub
    End Class
End Namespace
