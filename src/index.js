console.log('hi');

import * as d3 from 'd3';
import eventDrops from 'event-drops';

import { gravatar, humanizeDate } from './utils';
const repositories = require('./data.json');


const DEVCOUNT = localStorage.getItem("devCount");

if (DEVCOUNT === null) {
  localStorage.setItem("devCount", 1);
  console.log("new DEVCOUNT");
} else {
  localStorage.setItem("devCount", parseInt(DEVCOUNT) + 1);
}
console.log(`DEV COUNT: ${DEVCOUNT}`);

const numberCommitsContainer = document.getElementById('numberCommits');
const zoomStart = document.getElementById('zoomStart');
const zoomEnd = document.getElementById('zoomEnd');

const updateCommitsInformation = chart => {
  const filteredData = chart
    .filteredData()
    .reduce((total, repo) => total.concat(repo.data), []);

  numberCommitsContainer.textContent = filteredData.length;
  zoomStart.textContent = humanizeDate(chart.scale().domain()[0]);
  zoomEnd.textContent = humanizeDate(chart.scale().domain()[1]);
};

const tooltip = d3
  .select('body')
  .append('div')
  .classed('tooltip', true)
  .style('opacity', 0)
  .style('pointer-events', 'auto');

const chart = eventDrops({
  d3,
  zoom: {
    onZoomEnd: () => updateCommitsInformation(chart),
  },
  drop: {
    date: d => new Date(d.date),
    onMouseOver: commit => {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('pointer-events', 'auto');

      tooltip
        .html(
          `
                    <div class="commit">
                    <img class="avatar" src="${gravatar(
                        commit.author.email
                    )}" alt="${commit.author.name}" title="${
                        commit.author.name
                    }" />
                    <div class="content">
                        <h3 class="message">${commit.message}</h3>
                        <p>
                            <a href="https://www.github.com/${
                                commit.author.name
                            }" class="author">${commit.author.name}</a>
                            on <span class="date">${humanizeDate(
                                new Date(commit.date)
                            )}</span> -
                            <a class="sha" href="${
                                commit.sha
                            }">${commit.sha.substr(0, 10)}</a>
                        </p>
                    </div>
                `
        )
        .style('left', `${d3.event.pageX - 30}px`)
        .style('top', `${d3.event.pageY + 20}px`);
    },
    onMouseOut: () => {
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0)
        .style('pointer-events', 'none');
    },
  },
});

const repositoriesData = repositories.map(repository => ({
  name: repository.name,
  data: repository.commits,
}));

d3
  .select('#eventdrops-demo')
  .data([repositoriesData])
  .call(chart);

updateCommitsInformation(chart);

//
//
// const numberCommitsContainer = document.getElementById('numberCommits');
// const zoomStart = document.getElementById('zoomStart');
// const zoomEnd = document.getElementById('zoomEnd');
//
// const updateCommitsInformation = chart => {
//   const filteredData = chart
//     .filteredData()
//     .reduce((total, repo) => total.concat(repo.data), []);
//
//   numberCommitsContainer.textContent = filteredData.length;
//   zoomStart.textContent = humanizeDate(chart.scale().domain()[0]);
//   zoomEnd.textContent = humanizeDate(chart.scale().domain()[1]);
// };
//
//
//
// const chart = eventDrops({ d3 });
// const commits = [{
//   "name": "event-drops",
//   "commits": [{
//       "sha": "7ccf18b86328d5eb527d5cd803bca97b03640c6d",
//       "message": "Merge-pull-request-1409-from-zifnab87-master",
//       "author": {
//         "name": "Gildas Garcia",
//         "email": "gildas.garcia@gmail.com"
//       },
//       "date": "Tue, 23 Jan 2018 15:03:41 +0100"
//     },
//     {
//       "sha": "7659f9a6006f4742f47f4daf023b65f14162ef6a",
//       "message": "change-extraction-of-status-for-AUTH_ERROR",
//       "author": {
//         "name": "Michail Michailidis",
//         "email": "zifnab87@users.noreply.github.com"
//       },
//       "date": "Tue, 23 Jan 2018 15:54:25 +0200"
//     }
//   ]
// }];
//
// const repositoriesData = [{
//     name: 'admin-on-rest',
//     data: commits,
//   },
//   {
//     name: 'event-drops',
//     data: [{ date: new Date('2014/09/15 13:24:57') }, { date: new Date('2015/09/15 13:24:57') }, { date: new Date('2017/09/15 13:24:57') }],
//   },
//   {
//     name: 'sedy',
//     data: [{ date: new Date('2014/09/15 13:25:12') }, { date: new Date('2018/08/15 13:25:12') }],
//   },
// ];
//
//
// d3
//   .select('#eventdrops-demo')
//   .data([repositoriesData])
//   .call(chart);
//
// updateCommitsInformation(chart);