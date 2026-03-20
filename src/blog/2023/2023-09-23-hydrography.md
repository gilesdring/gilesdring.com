---
title: Exploring the Environment Agency Hydrology API
url: false
draft: true
categories:
  - data
  - climate
---


I was interested to read the excellent blog post on [Tracking environmental data using the Hydrology service API](https://www.epimorphics.com/ea-hydrology-api/) published by Epimorphics. It contains excellent useful information on downloading useful data from the Environment Agency Hydrology Service. I've long had an idea about a project doing this related to my local area, so it seemed like a good time to leap in.


TKTKTK

I live in Hebden Bridge.
Flooding.
Slow the Flow
Hypothesis is that FFT analysis should show a lower frequency component in the rate of change of water levels.

## The code

Let's start by loading up some Python libraries.


```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
```

I've also created a function to perform a short time fourier analysis, in a sliding window. This will enable me to plot a spectrogram showing the frequency component of the input signal. 


```python
from signals import stft
```

Firstly, I need to get access to the raw data for a couple of sites. The [river levels Nutclough](https://environment.data.gov.uk/hydrology/station/35e2af93-dfc1-4a38-8cb1-26e3076c3941), and data from the [rainfall gauge at Walshaw Dean Lodge](https://environment.data.gov.uk/hydrology/station/445f2262-65b1-4904-9587-c9bdfea18d50). As these are CSV endpoints, the bulk data download can be automated with DVC, meaning I won't need to hit that API to frequently, as advised in the blog post.

Having done that, I can load the data into `pandas` dataframes


```python
sns.set_theme()
%matplotlib inline
```

I'm only interested in data since 2010, so I'll set up a filtering value.


```python
earliest_date = pd.to_datetime('2010')
```

First I'll read the levels, filter by date and convert the measure name to something meaningful 


```python
levels = pd.read_csv('../../data/hydrography/nutclough-levels.csv', parse_dates=['dateTime', 'date'], dtype={'qcode': 'str'})
levels = levels.loc[levels.date >= earliest_date]
levels.measure = 'river_level_at_nutclough'
```

Then do the same for rainfall at Walshaw Dean Lodge.


```python
rainfall = pd.read_csv('../../data/hydrography/walshaw-dean-lodge-rainfall.csv', parse_dates=['dateTime', 'date'], dtype={'qcode': 'str'})
rainfall = rainfall.loc[rainfall.date >= earliest_date]
rainfall.measure = 'rainfall_at_walshaw_dean_lodge'
```

Let's find the most rainy days since 2010. These happen to coincide with significant flooding events in Hebden Bridge.


```python
rainy_days = rainfall.groupby('date').value.sum().sort_values(ascending=False).head(10).index.sort_values().to_list()
print('\n'.join([d.strftime('%d %B %Y') for d in rainy_days]))
```

    04 November 2010
    22 June 2012
    06 July 2012
    18 December 2014
    26 December 2015
    16 March 2019
    07 November 2019
    09 February 2020
    25 August 2020
    06 February 2021



```python
def filter_between_dates(data, start_date, end_date, key='date'):
    return data.loc[(data[key] >= start_date) & (data[key] < end_date)]


def filter_around_days(data, date, offset=1):
    start_day = date - pd.DateOffset(days=offset)
    end_day = date + pd.DateOffset(days=offset+1)
    return data.pipe(filter_between_dates, start_day, end_day)


def plot_fft(data, title, fs, fft_size):
    plt.title(title)
    plt.imshow(np.transpose(data), origin='lower', cmap='jet', interpolation='nearest', aspect='auto')
    plt.ylabel('Frequency (Hz)')
    plt.xlabel('Date')
    plt.xticks([])
    plt.ticklabel_format(scilimits=[1,-1])
    num_ticks = 5
    plt.yticks(np.arange(num_ticks) * fft_size/(num_ticks-1), [f"{x:.1e}" for x in np.arange(num_ticks) * fs/2/(num_ticks-1)])


def visualise(data, sampling_time, fft_size=32):
    fs = 1.0 / sampling_time
    friendly_date = f"{data.date.min().strftime('%d %b %Y')} to {data.date.max().strftime('%d %b %Y')}"

    fft_data = stft(data.value)
    t_max = len(fft_data) / np.float32(fs)
    print(t_max)

    plt.figure(figsize = (12, 6))
    plt.subplot(121)
    plt.plot(data.index, data.value, 'g')
    plt.title(f'River levels for {friendly_date}')
    plt.xlabel('Date')
    plt.xticks(rotation=45, ha='right')
    plt.ylabel('Level')

    plt.subplot(122)
    plot_fft(fft_data, f'Spectrum for {friendly_date}', fs=fs, fft_size=fft_size)
    plt.show()
```


```python
ts = 15 * 60 # Sampling is 15 minutes
```


```python
levels.pipe(filter_around_days, rainy_days[4]).set_index('dateTime').pipe(visualise, ts)
```

    7199.999825656419



    
![png](/hydrography_files/hydrography_18_1.png)
    



```python
levels.pipe(filter_around_days, rainy_days[7]).set_index('dateTime').pipe(visualise, ts)
```

    7199.999825656419



    
![png](/hydrography_files/hydrography_19_1.png)
    



```python
combined = pd.concat([
    levels,
    rainfall
]).pivot(index='dateTime', columns='measure', values='value')
combined.columns.name=None
```


```python
def filter_event(data, start, end):
    event_data = data \
      .reset_index() \
      .pipe(filter_between_dates, start, end, key='dateTime') \
      .set_index('dateTime')
    event_data['cumulative_rainfall'] = event_data.rainfall_at_walshaw_dean_lodge.cumsum()
    return event_data
```


```python
def perform_fft(data):
    X = np.fft.fft(data.river_level_at_nutclough)
    N = len(X)
    F = np.fft.fftfreq(N, d=60*15)
    n_oneside = N//2

    return pd.DataFrame({
      'freq': F[:n_oneside],
      'magnitude': 20 * np.log10(np.abs(X[:n_oneside]))
    })

def plot_levels(data):
    plt.plot(data.dateTime, data.river_level_at_nutclough, 'g')
    plt.xticks(rotation=45, ha='right')

def plot_fft(data):
    plt.plot(data.freq, data.magnitude, 'r')
    plt.show()

def rising_analysis(data):
    fft_data = data.pipe(perform_fft)
    plt.figure(figsize = (12, 6))
    plt.subplot(121)
    data.reset_index().pipe(plot_levels)
    plt.subplot(122)
    fft_data.pipe(plot_fft)
    plt.show()

    return fft_data

```


```python
dec_2015 = combined.pipe(filter_event, pd.Timestamp('2015-12-26T03:00'), pd.Timestamp('2015-12-26T13:00'))
dec_2015_fft = dec_2015.resample('T').interpolate().pipe(rising_analysis)
```


    
![png](/hydrography_files/hydrography_23_0.png)
    



```python
# Rain started at 2020-02-08T18:00
feb_2020 = combined.pipe(filter_event, pd.Timestamp('2020-02-09T09:00'), pd.Timestamp('2020-02-09T12:00'))
feb_2020_fft = feb_2020.resample('T').interpolate().pipe(rising_analysis)
```


    
![png](/hydrography_files/hydrography_24_0.png)
    



```python
ffts = [
  combined.reset_index().pipe(filter_between_dates, d, d + pd.DateOffset(days=1), key='dateTime').set_index('dateTime').pipe(perform_fft) for d in rainy_days
]

```


```python
plt.figure(figsize = (12, 6))
for d in rainy_days:
  fft = combined.reset_index().pipe(filter_between_dates, d, d + pd.DateOffset(days=1), key='dateTime').set_index('dateTime').resample('5T').interpolate().pipe(perform_fft)
  fft.loc[fft.freq == 0, 'magnitude'] = 0
  plt.plot(fft.freq, fft.magnitude, label=d.strftime('%d %b %Y'))
  plt.legend()
plt.show()
```


    
![png](/hydrography_files/hydrography_26_0.png)
    



```python
feb_2020_fft.loc[feb_2020_fft.freq == 0, 'magnitude'] = 0
```


```python
feb_2020_fft.pipe(plot_fft)
```


    
![png](/hydrography_files/hydrography_28_0.png)
    



```python

```
