import os 


def export_vars(request):
    data = {}
    data['SCRIPT_NAME'] = os.environ.get('SCRIPT_NAME')
    return data