    /******************R E P O R T E S      U S A C S I A*******************/
  // CONTROL DIARIO
   function generate_reportes() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  

        pdf.setProperties({
          title: 'Reportes de control diario'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "CONTROL DIARIO");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };

        var res = pdf.autoTableHtmlToJson(document.getElementById("tableREP"));
        var col=res.columns;
        col.splice(8,8);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {       
             0: {columnWidth: 'auto'},
             1: {columnWidth: 'auto'},
             2: {columnWidth: 'auto'},
             3: {columnWidth: 'auto'},
             4: {columnWidth: 'auto'},
             5: {columnWidth: 'auto'},
             6: {columnWidth: 'auto'},
             7: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };


  // SIGNOS VITALES
  function generate_signos() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  

        pdf.setProperties({
          title: 'Reportes de control diario'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "REPORTES DE SIGNOS VITALES");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };

        var res = pdf.autoTableHtmlToJson(document.getElementById("tableREPS"));
        var col=res.columns;
        col.splice(16,16);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {       
             0: {columnWidth: 'auto'},
             1: {columnWidth: 'auto'},
             2: {columnWidth: 'auto'},
             3: {columnWidth: 'auto'},
             4: {columnWidth: 'auto'},
             5: {columnWidth: 'auto'},
             6: {columnWidth: 'auto'},
             7: {columnWidth: 'auto'},
             8: {columnWidth: 'auto'},
             9: {columnWidth: 'auto'},            
             10: {columnWidth: 'auto'},
             11: {columnWidth: 'auto'},
             12: {columnWidth: 'auto'},
             13: {columnWidth: 'auto'},
             14: {columnWidth: 'auto'},
             15: {columnWidth: 'auto'},
             16: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };
        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

 // INFORME DIARIO
   function generate_informesdiario() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  

        pdf.setProperties({
          title: 'Reportes de control diario'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "REPORTES DE INFORME DIARIO");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };

        var res = pdf.autoTableHtmlToJson(document.getElementById("tableREP"));
        var col=res.columns;
        col.splice(12,12);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {       
             0: {columnWidth: 'auto'},
             1: {columnWidth: 'auto'},
             2: {columnWidth: 'auto'},
             3: {columnWidth: 'auto'},
             4: {columnWidth: 'auto'},
             5: {columnWidth: 'auto'},
             6: {columnWidth: 'auto'},
             7: {columnWidth: 'auto'},
             8: {columnWidth: 'auto'},
             9: {columnWidth: 'auto'},
             10: {columnWidth: 'auto'},
             11: {columnWidth: 'auto'},
             12: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

   // INFORME OBSERVADOS
   function generate_observado() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  

        pdf.setProperties({
          title: 'Reportes de control diario'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "INFORME DE PACIENTES OBSERVADOS");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };

        var res = pdf.autoTableHtmlToJson(document.getElementById("tableREP"));
        var col=res.columns;
        col.splice(5,5);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {       
             0: {columnWidth: 'auto'},
             1: {columnWidth: 'auto'},
             2: {columnWidth: 'auto'},
             3: {columnWidth: 'auto'},
             4: {columnWidth: 'auto'},
             5: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

/*  1)  funcionarios  */
function generateFUN_AE() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  


        pdf.setProperties({
          title: 'Lista de personal de USACSIA'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "LISTA DE PERSONAL DE USACSIA");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };


        var res = pdf.autoTableHtmlToJson(document.getElementById("table"));
        var col=res.columns;
        col.splice(4,5);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {
            //1: {columnWidth: 'auto'}
           0: {columnWidth: 'auto'},
           1: {columnWidth: 'auto'},
           2: {columnWidth: 'auto'},
           3: {columnWidth: 'auto'},
           4: {columnWidth: 'auto'},
           5: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

      /*  2) consultorios*/

function generateCon_usa() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  


        pdf.setProperties({
          title: 'Lista de consultorios'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "LISTA DE CONSULTORIOS");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };


        var res = pdf.autoTableHtmlToJson(document.getElementById("table"));
        var col=res.columns;
        col.splice(3,5);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {
            //1: {columnWidth: 'auto'}
           0: {columnWidth: 'auto'},
           1: {columnWidth: 'auto'},
           2: {columnWidth: 'auto'},
           3: {columnWidth: 'auto'},
           4: {columnWidth: 'auto'},
           5: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

   /*  3) laboratorios*/

function generateLab() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  


        pdf.setProperties({
          title: 'Lista de laboratorios'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "LISTA DE LABORATORIOS");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };


        var res = pdf.autoTableHtmlToJson(document.getElementById("table"));
        var col=res.columns;
        col.splice(3,5);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {
            //1: {columnWidth: 'auto'}
           0: {columnWidth: 'auto'},
           1: {columnWidth: 'auto'},
           2: {columnWidth: 'auto'},
           3: {columnWidth: 'auto'},
           4: {columnWidth: 'auto'},
           5: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

   /*  3) asignacion zonas*/

function generateaszon() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  


        pdf.setProperties({
          title: 'Lista de laboratorios'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "LISTA DE LABORATORIOS");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };


        var res = pdf.autoTableHtmlToJson(document.getElementById("tableZon"));
        var col=res.columns;
        col.splice(3,5);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {
            //1: {columnWidth: 'auto'}
           0: {columnWidth: 'auto'},
           1: {columnWidth: 'auto'},
           2: {columnWidth: 'auto'},
           3: {columnWidth: 'auto'},
           4: {columnWidth: 'auto'},
           5: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

/*  inspectores */
function generateIns() {
        var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  


        pdf.setProperties({
          title: 'Lista de empresas que no cancelaron el arancel'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "LISTA DE EMPRESAS QUE NO CANCELARON ARANCEL");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
        };


        var res = pdf.autoTableHtmlToJson(document.getElementById("table"));
        var col=res.columns;
        col.splice(4,5);
        pdf.autoTable(col, res.data, {
          addPageContent: pageContent,
          theme: 'grid',
          //startY: pdf.autoTableEndPosY() + 30,
          startY: 60,
          styles: {
            overflow: 'linebreak',
            fontSize: 10,
            rowHeight: 40,
            columnWidth: 'wrap'
          },
          columnStyles: {
            //1: {columnWidth: 'auto'}
           0: {columnWidth: 'auto'},
           1: {columnWidth: 'auto'},
           2: {columnWidth: 'auto'},
           3: {columnWidth: 'auto'},
           4: {columnWidth: 'auto'},
           5: {columnWidth: 'auto'}
          }
        });
        
        if (typeof pdf.putTotalPages === 'function') {
            pdf.putTotalPages(totalPagesExp);
        };

        /*pdf.save(pdfsize + ".pdf");*/
        pdf.output("dataurlnewwindow");

      };

      /*  2) consultorios*/

    function ordenPago() {
      var pdfsize = 'a4';
        var pdf = new jsPDF('l', 'pt', 'letter');  
        pdf.setProperties({
          title: 'ORDEN DE PAGO'
        });

        var totalPagesExp = "{total_pages_count_string}";
        var pageContent = function (data) {
             // HEADER
              pdf.text(280,30, "ORDEN DE PAGO");
            //FOOTER
              var str = "Página " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof pdf.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              pdf.setFontSize(10);
              pdf.text(str, data.settings.margin.left, pdf.internal.pageSize.height - 10);
              
        };
        // var datos1=document.getElementById("propietario").innerHTML;
        // console.log('datos1----', datos1);
        var res = pdf.autoTableHtmlToJson(document.getElementById("tablaArancel"));
              var col=res.columns;
              // col.splice(4,5);
        // var res1 = pdf.autoTableHtmlToJson(document.getElementById("total"));
        //       var col1=res1.columns;
              // col1.splice(4,5);
              // pdf.autoTable(col1, res1.data, {
              //         addPageContent: pageContent,
              //         theme: 'grid',
              //         //startY: pdf.autoTableEndPosY() + 30,
              //         startY: 260,
              //         styles: {
              //           overflow: 'linebreak',
              //           fontSize: 10,
              //           rowHeight: 40,
              //           columnWidth: 'wrap'
              //         },
              //         columnStyles: {
              //           //1: {columnWidth: 'auto'}
              //          0: {columnWidth: 'auto'},
              //          1: {columnWidth: 'auto'},
              //          2: {columnWidth: 'auto'},
              //          3: {columnWidth: 'auto'},
              //          4: {columnWidth: 'auto'},
              //          5: {columnWidth: 'auto'}
              //         }
              //       });

              pdf.autoTable(col, res.data, {
                addPageContent: pageContent,
                theme: 'grid',
                //startY: pdf.autoTableEndPosY() + 30,
                startY: 60,
                styles: {
                  overflow: 'linebreak',
                  fontSize: 10,
                  rowHeight: 40,
                  columnWidth: 'wrap'
                },
                columnStyles: {
                  //1: {columnWidth: 'auto'}
                 0: {columnWidth: 'auto'},
                 1: {columnWidth: 'auto'},
                 2: {columnWidth: 'auto'},
                 3: {columnWidth: 'auto'},
                 4: {columnWidth: 'auto'},
                 5: {columnWidth: 'auto'}
                }
              });


                    


              
              if (typeof pdf.putTotalPages === 'function') {
                  pdf.putTotalPages(totalPagesExp);
              };

              /*pdf.save(pdfsize + ".pdf");*/
              pdf.output("dataurlnewwindow");
    }