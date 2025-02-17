---
title: Upload Files and Select Additional Metadata
page_title: Upload Files and Select Additional Metadata
description: "Learn how to upload files and select additional metadata with the Kendo UI Upload widget."
slug: howto_select_additional_metadata_upload
previous_url: /controls/editors/upload/how-to/select-additional-metadata
tags: telerik, kendo, jquery, upload, upload, files, and, select, additional, metadata
component: upload
type: how-to
res_type: kb
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress Kendo UI Upload for jQuery</td>
 </tr>
 <tr>
  <td>Operating System</td>
  <td>Windows 10 64bit</td>
 </tr>
 <tr>
  <td>Visual Studio version</td>
  <td>Visual Studio 2017</td>
 </tr>
 <tr>
  <td>Preferred Language</td>
  <td>JavaScript</td>
 </tr>
</table>

## Description

How can I upload files and select additional metadata by using the Kendo UI Upload?

## Solution

The following example demonstrates how to achieve the desired scenario.



```dojo
<div id="example">
          <h3>Upload files and select additional metadata</h3>
            <div class="demo-section k-header">
                <input type="file" name="files" id="files" />
            </div>

            <script id="fileTemplate" type="text/x-kendo-template">
                <span class='k-progress'></span>
                <div class='file-wrapper'>
                    <h4 class='file-heading file-name-heading'>Name: #=name#</h4>
                    <h4 class='file-heading file-size-heading'>Size: #=size# bytes</h4>
                    <h4 class='file-heading'>Uploaded by:</h4>
                    <select class="info">
                        <option>Developer</option>
                        <option>Support</option>
                        <option>QA</option>
                        <option>HR</option>
                    </select>
                    <button type='button' class='k-upload-action'></button>
                </div>
            </script>

            <script>
                $(document).ready(function () {
                    $("#files").kendoUpload({
                        multiple: true,
                        async: {
                            saveUrl: "save",
                            removeUrl: "remove",
                            autoUpload: false
                        },
                        template: kendo.template($('#fileTemplate').html()),
                      	select: onSelect,
                    	upload: onUpload
                    });
                });

                function onSelect(e){
                  var upload = this;
                  var files = e.files;

                  setTimeout(function(){
                  	for(var i = 0; i < files.length; i++){
                      var select = upload.wrapper.find(".k-file[data-uid='" + files[i].uid +"'] select");
                      select.kendoDropDownList();
                    }
                  });
                }

              function onUpload(e){
              	var upload = this;
                var dropdown = upload.wrapper.find(".k-file[data-uid='" + e.files[0].uid +"'] select").data("kendoDropDownList");

                e.data = {
                    uploader: dropdown.value()
                };
              }
            </script>

            <style scoped>
			  html {
				font-size: 12px;
				font-family: Arial, Helvetica, sans-serif;
			  }

              #example {
              	width: 800px;
              }

                #example .file-heading
                {
                    font-family: Arial;
                    font-size: 1.0em;
                    line-height: 35px;
                    display: inline-block;
                    float: left;
                    margin: 0 20px 0 20px;
                    height: 25px;
                    -ms-text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    overflow:hidden;
                    white-space:nowrap;
                }

                    #example .file-name-heading
                    {
                        font-weight: bold;
                    }

                     #example .file-size-heading
                    {
                        font-weight: normal;
                        font-style: italic;
                    }

                .k-dropdownlist{
                    width:auto;
                }

                li.k-file div.file-wrapper
                {
                    position: relative;
                    height: 33px;
                }
            </style>
        </div>


    </script>
```


## See Also

* [JavaScript API Reference of the Upload](/api/javascript/ui/upload)
* [Modes of Operation]({% slug modes_upload_widget %})
* [Metadata]({% slug metadata_upload_widget %})


