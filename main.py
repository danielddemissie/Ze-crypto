import yfinance as yf
import os
import plotly.graph_objects as go
from datetime import date, timedelta
today = date.today()
d1 = today.strftime("%Y-%m-%d")
end_date = d1
d2 = date.today() - timedelta(days=30)
d2 = d2.strftime("%Y-%m-%d")
start_date = d2
coinName,userName=input().split("_");

data = yf.download(coinName, 
                      start=start_date, 
                      end=end_date, 
                      progress=False)
data["Date"] = data.index
data = data[["Date", "Open", "High", "Low", "Close", "Adj Close", "Volume"]]
data.reset_index(drop=True, inplace=True)
print(data.head())


figure = go.Figure(data=[go.Candlestick(x=data["Date"],
                                        open=data["Open"], 
                                        high=data["High"],
                                        low=data["Low"], 
                                        close=data["Close"])])
figure.update_layout(title = "Bitcoin Price Analysis", 
                     xaxis_rangeslider_visible=False)
if not os.path.exists("/public/images"):
    os.mkdir("/public/images")
figure.write_image('/public/images/'+userName+coinName+'.png')    
figure.show()