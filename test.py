import time

import requests

URL = 'https://api.pricescout.yuanowo.xyz/api/v1/healthz'


def keep_alive():
    print("Type 'Ctrl + C' to stop the program.")
    while True:
        try:
            resp = requests.get(URL)
            if resp.status_code == 200:
                print('Server is alive!')
            else:
                print('Server is down!')
            time.sleep(60)
        except KeyboardInterrupt:
            print('Program stopped.')
            break


if __name__ == '__main__':
    keep_alive()
