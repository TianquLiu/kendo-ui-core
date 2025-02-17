---
title: Create Timelines by Using Range Bars in Charts
page_title: Create Timelines by Using Range Bars in Charts
description: "Learn how to display a daily timeline for two users in a Kendo UI Chart."
previous_url: /controls/charts/how-to/timeline-using-range-bars, /controls/charts/how-to/various/timeline-using-range-bars
slug: howto_createtimeline_usingrangebars_charts
tags: chart, create, timelines, using, range, bars
component: chart
type: how-to
res_type: kb
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress Kendo UI Chart for jQuery</td>
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

How can I display a daily timeline for two users in a Kendo UI Chart?

## Solution

When implementing the suggested solution, note the following:

* The time of the day is represented as a time span, relative to a fixed date&mdash;for example, 01.Jan.
* Each slot has a unique ID.
* To create one series per data site, the data source is grouped by ID. This is important because, normally, a series can have only one data point per category.
* Categories are bound to model fields.
* Series spacing is set to `-1` (-100%), so that series can line up with each other. Normally, they are rendered one below the other.
* Value axis labels are formatted to display the time of the day and are spaced one hour apart.

The following example demonstrates how to create a timeline by using range bars.

```dojo
    <div id="chart"></div>
    <script>
    var data = [{
        id: 1,
        user: "Jon",
        from: new Date("2014/01/01 11:30").getTime(),
        to: new Date("2014/01/01 14:45").getTime()
      }, {
        id: 2,
        user: "Joe",
        from: new Date("2014/01/01 09:30").getTime(),
        to: new Date("2014/01/01 09:45").getTime()
      }, {
        id: 3,
        user: "Joe",
        from: new Date("2014/01/01 10:00").getTime(),
        to: new Date("2014/01/01 10:15").getTime()
      }, {
        id: 4,
        user: "Joe",
        from: new Date("2014/01/01 12:00").getTime(),
        to: new Date("2014/01/01 14:00").getTime()
      }, {
        id: 5,
        user: "Joe",
        from: new Date("2014/01/01 15:15").getTime(),
        to: new Date("2014/01/01 15:30").getTime()
      }, {
        id: 6,
        user: "Joe",
        from: new Date("2014/01/01 15:45").getTime(),
        to: new Date("2014/01/01 16:00").getTime()
      }];

      $("#chart").kendoChart({
        dataSource: {
          data: data,
          group: {
            field: "id",
            dir: "desc"
          }
        },
        series: [{
          type: "rangeBar",
          fromField: "from",
          toField: "to",
          categoryField: "user",
          spacing: -1
        }],
        valueAxis: {
          min: new Date("2014/01/01 08:00").getTime(),
          max: new Date("2014/01/01 17:00").getTime(),
          majorUnit: 60 * 60 * 1000, // 60 minutes in milliseconds
          labels: {
            template: "#= kendo.toString(new Date(value), 'HH:mm') #"
          }
        },
        legend: {
          visible: false
        }
      });
  </script>
```

## See Also

* [Chart JavaScript API Reference](/api/javascript/dataviz/ui/chart)
* [Drawing API]({% slug overview_kendoui_drawingapi %})
* [How to Aggregate Data in Pie Charts]({% slug howto_aggregatedata_piecharts %})
* [How to Draw on Scatter Plots Surface]({% slug howto_drawonscatterplotssurface_charts %})
* [How to Expand Clickable Area of Points]({% slug howto_extendclickableareaofpoints_charts %})
