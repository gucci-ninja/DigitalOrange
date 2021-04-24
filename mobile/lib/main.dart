import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mobile/contract.dart';
import 'package:provider/provider.dart';
import 'package:mobile/add_item.dart';
import 'package:mobile/scan_item.dart';

void main() => runApp(const MyApp());

/// This is the main application widget.
class MyApp extends StatelessWidget {
  const MyApp({Key key}) : super(key: key);

  static const String _title = 'Digital Orange';

  @override
  Widget build(BuildContext context) {
    // Inserting Provider as a parent of HelloUI()
    return ChangeNotifierProvider<Contract>(
      create: (_) => Contract(),
      child: MaterialApp(
        title: _title,
        home: ScreensWidget(),
      ),
    );
  }
}

/// This is the stateful widget that the main application instantiates.
class ScreensWidget extends StatefulWidget {
  const ScreensWidget({Key key}) : super(key: key);

  @override
  State<ScreensWidget> createState() => _ScreensWidgetState();
}

/// This is the private State class that goes with ScreensWidget
class _ScreensWidgetState extends State<ScreensWidget> {
  int _selectedIndex = 1;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 30, fontWeight: FontWeight.bold);
  static List<Widget> _widgetOptions = <Widget>[QRViewExample(), AddItem()];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Orange'),
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.photo_camera),
            label: 'Scan Item',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: 'Add Item',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
    );
  }
}
